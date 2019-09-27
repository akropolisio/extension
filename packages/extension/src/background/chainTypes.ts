import { RegistryTypes } from '@polkadot/types/types';
import { akroNodes } from '@polkadot/extension-ui/constants';

export const akroApiUrls = akroNodes.map(item => item.value);

/* eslint-disable @typescript-eslint/camelcase */
export const akroTypes: RegistryTypes = {
  Count: 'u64',
  DaoId: 'u64',
  MemberId: 'u64',
  ProposalId: 'u64',
  TokenBalance: 'u64',
  VotesCount: 'MemberId',
  TokenId: 'u32',
  Days: 'u32',
  Rate: 'u32',
  Dao: {
    address: 'AccountId',
    name: 'Text',
    description: 'Bytes',
    founder: 'AccountId'
  },
  Action: {
    _enum: {
      EmptyAction: null,
      AddMember: 'AccountId',
      RemoveMember: 'AccountId',
      GetLoan: '(Vec<u8>, Days, Rate, Balance)',
      Withdraw: '(AccountId, Balance, Vec<u8>)'
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any, // because RegistryTypes is wrong
  Proposal: {
    dao_id: 'DaoId',
    action: 'Action',
    open: 'bool',
    accepted: 'bool',
    voting_deadline: 'BlockNumber',
    yes_count: 'VotesCount',
    no_count: 'VotesCount'
  },
  Token: {
    token_id: 'u32',
    symbol: 'Vec<u8>'
  },
  Status: {
    _enum: [
      'Pending',
      'Withdraw',
      'Approved',
      'Canceled',
      'Confirmed'
    ]
  },
  Message: {
    message_id: 'H256',
    eth_address: 'H160',
    substrate_address: 'AccountId',
    amount: 'TokenBalance',
    status: 'Status'
  },
  BridgeTransfer: {
    transfer_id: 'ProposalId',
    message_id: 'H256',
    open: 'bool',
    votes: 'MemberId'
  }
};
