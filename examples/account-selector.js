import React from 'react';
import { accounts as accountArray } from './example-data';
import AccountSelector from '../src/account-selector';

const AccountSelectorExample = () => {

  const preSelectedAccountNumber = '42010205683';

  function getAccount(accounts, accountNumber) {
    return accounts.find(account => account.accountNumber === accountNumber);
  }

  function onChange(accountNumberOrUserInput) {
    console.log('account changed', accountNumberOrUserInput);
  }

  function onBlur(selectedAccount, inputvalue) {
    console.log('account selector lost focus, selected account:', selectedAccount);
  }

  function onFocus() {
    console.log('account selector gained focus');
  }

  function onAccountSelected(value) {
    console.log('account selected', value);
  }

  return (
    <div className="selector">
      <label htmlFor="custom-id" className="ffe-form-label selector-label">Velg konto</label>
      <AccountSelector
        accounts={ accountArray }
        onAccountSelected={ onAccountSelected }
        onChange={ onChange }
        onBlur={ onBlur }
        onFocus={ onFocus }
        locale="nb"
        placeholder="Velg Konto"
        noMatches="Ingen kontoer"
        id="custom-id"
        selectedAccount={ getAccount(accountArray, preSelectedAccountNumber) }
      />
    </div>
  );
};

export default AccountSelectorExample;
