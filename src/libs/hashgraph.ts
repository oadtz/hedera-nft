import {
  AccountBalance,
  AccountBalanceQuery,
  AccountId,
  Client,
  NftId,
  PrivateKey,
  TokenId,
  TokenInfo,
  TokenInfoQuery,
  TokenNftInfo,
  TokenNftInfoQuery,
} from "@hashgraph/sdk";

interface IAccount {
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
    accountId: operatorId,
    accountKey: operatorKey,
  },
  alice: {
    accountId: AccountId.fromString("0.0.34287266"),
    accountKey: PrivateKey.fromString(
      "302e020100300506032b65700422042000635792a9de41789b297288add98f6490b57709400b879aa9ebabf6c98d8da7"
    ),
  },
  bob: {
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
