import AccountDetailsUpdate from './AccountDetails/AccountDetailsUpdate'
import AddressChangeSection from './AccountDetails/AddressChangeSection'
import Footer from "../Home/Footer"
import ChangePinUpdate from './AccountDetails/ChangePinUpdate'
import ChangeAccountPasswordSection from './AccountDetails/ChangeAccountPasswordSection'
import UserDetails from './AccountDetails/UserDetails'
import { AuthContext } from '../Context/AuthContext'
import { useContext } from 'react'
import SetAtmPinPage from './AccountCreation/SetAtmPinPage'

function AccountDetails() {
  const {account, loading} = useContext(AuthContext);
    if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
        <span className="ml-3">Loading...</span>
      </div>
    );
  }
  return (
    <div>
      <UserDetails/>
      <AccountDetailsUpdate/>
      <AddressChangeSection/>
      {account?.pinSet ? <ChangePinUpdate/> :<SetAtmPinPage/>}
      <ChangeAccountPasswordSection/>
      <Footer/>
    </div>
  )
}

export default AccountDetails