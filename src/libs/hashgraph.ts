import faker from "@faker-js/faker";
import {
  AccountBalance,
  AccountBalanceQuery,
  AccountId,
  Client,
  NftId,
  PrivateKey,
  TokenAssociateTransaction,
  TokenCreateTransaction,
  TokenId,
  TokenInfo,
  TokenInfoQuery,
  TokenNftInfo,
  TokenNftInfoQuery,
  TokenSupplyType,
  TokenType,
  TransferTransaction,
} from "@hashgraph/sdk";

export interface IAccount {
  accountName: string;
  accountId: AccountId;
  accountKey: PrivateKey;
}

const operatorId = AccountId.fromString("0.0.34319544");
const operatorKey = PrivateKey.fromString(
  "302e020100300506032b657004220420b5d9ed1c1034e9c24e6a9f0afc91b2633a8b1392871a1ea722c7b046813845c3"
);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

export const account = {
  treasury: {
    accountName: "Treasury",
    accountId: operatorId,
    accountKey: operatorKey,
  },
  alice: {
    accountName: "Alice",
    accountId: AccountId.fromString("0.0.34287266"),
    accountKey: PrivateKey.fromString(
      "302e020100300506032b65700422042000635792a9de41789b297288add98f6490b57709400b879aa9ebabf6c98d8da7"
    ),
  },
  bob: {
    accountName: "Bob",
    accountId: AccountId.fromString("0.0.34398482"),
    accountKey: PrivateKey.fromString(
      "302e020100300506032b657004220420a1fa95b792bc00c3987e22d3101b622d4853b00abdb0196f611473326c13edde"
    ),
  },
};

export const checkBalance = async (
  account: IAccount
): Promise<AccountBalance> => {
  const balanceCheckTx = await new AccountBalanceQuery()
    .setAccountId(account.accountId)
    .execute(client);

  return balanceCheckTx;
};

export const getTokenInfo = async (
  tokenId: string
): Promise<{ token: TokenInfo; nft: TokenNftInfo }> => {
  const nftId = new NftId(TokenId.fromString(tokenId), 1);
  const [nft] = await new TokenNftInfoQuery().setNftId(nftId).execute(client);
  const token = await new TokenInfoQuery().setTokenId(tokenId).execute(client);

  return { token, nft };
};

export const mintToken = async () => {
  const nftCreate = await new TokenCreateTransaction()
    .setTokenName(faker.vehicle.model())
    .setTokenSymbol(faker.hacker.abbreviation())
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(account.treasury.accountId)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(1)
    //.setCustomFees([nftCustomFee])
    .setAdminKey(operatorKey)
    .setSupplyKey(operatorKey)
    .setPauseKey(operatorKey)
    .setFreezeKey(operatorKey)
    .setWipeKey(operatorKey)
    .freezeWith(client)
    .sign(operatorKey);

  const nftCreateTxSign = await nftCreate.sign(operatorKey);
  const nftCreateSubmit = await nftCreateTxSign.execute(client);
  const nftCreateRx = await nftCreateSubmit.getReceipt(client);

  if (nftCreateRx.tokenId)
    return await getTokenInfo(nftCreateRx.tokenId?.toString());
};

export const transferNFT = async (tokenId: string, targetAccount: IAccount) => {
  try {
    const associateTx = await new TokenAssociateTransaction()
      .setAccountId(targetAccount.accountId)
      .setTokenIds([tokenId])
      .freezeWith(client)
      .sign(targetAccount.accountKey);
    await associateTx.execute(client);

    const ownerId = await (await getTokenInfo(tokenId)).nft.accountId;
    const owner = Object.values(account).find(
      (x) => x.accountId.toString() === ownerId.toString()
    ) as IAccount;

    const tokenTransferTx = await new TransferTransaction()
      .addNftTransfer(tokenId, 1, owner.accountId, targetAccount.accountId)
      .addHbarTransfer(owner.accountId, 100)
      .addHbarTransfer(targetAccount.accountId, -100)
      .freezeWith(client)
      .sign(owner.accountKey);
    await tokenTransferTx.execute(client);
  } catch (e) {
    alert(e);
  }
};
