import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type MainContractConfig = {
  number: number;
  address: Address;
  owner_address: Address;
};

export function mainContractConfigToCell(config: MainContractConfig): Cell {
  return beginCell()
    .storeUint(config.number, 32)
    .storeAddress(config.address)
    .storeAddress(config.owner_address)
    .endCell();
}

export class MainContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) { }

  static createFromConfig(config: MainContractConfig, code: Cell, workchain = 0) {
    const data = mainContractConfigToCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new MainContract(address, init);
  }

  // 使用 provider.internal(...) 发送了一条内部消息到合约地址。根据 TON 的机制：
  // 1.如果此地址尚未部署合约（即地址尚未初始化），这条内部消息将触发合约的部署过程，合约代码将被写入到该地址，并完成初始化。
  // 2.如果此地址已经存在合约代码，则这条消息会被作为普通内部消息传递给合约，由合约代码决定如何处理（如执行某个函数或变更状态）。
  async sendDeploy(provider: ContractProvider, sender: Sender, value: bigint) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendIncrement(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    increment_by: number
  ) {
    const msg_body = beginCell().storeUint(1, 32).storeUint(increment_by, 32).endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async sendDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
    const msg_body = beginCell()
      .storeUint(2, 32) // 2存款操作码
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body
    });
  }

  async sendNoCodeDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
    const msg_body = beginCell().endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body
    });
  }

  async sendWithdrawalRequest(provider: ContractProvider, sender: Sender, value: bigint, amount: bigint) {
    const msg_body = beginCell()
      .storeUint(3, 32) // OP code
      .storeCoins(amount)
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_contract_storage_data", []);
    return {
      number: stack.readNumber(),
      recent_sender: stack.readAddress(),
      owner_address: stack.readAddress(),
    };
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", []);
    return {
      balance: stack.readNumber()
    }
  }
}