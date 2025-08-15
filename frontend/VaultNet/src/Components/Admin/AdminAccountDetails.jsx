import AdminAccountDetailsUpdate from './AccountDetails/AdminAccountDetailsUpdate'
import AdminAddressChangeSection from './AccountDetails/AdminAddressChangeSection'
import Footer from "../Home/Footer"
import AdminChangeAccountPasswordSection from './AccountDetails/AdminChangeAccountPasswordSection'
import AdminUserDetails from './AccountDetails/AdminUserDetails'
import { AuthContext } from '../Context/AuthContext'
import { useContext } from 'react'

function AdminAccountDetails() {
  const {loading} = useContext(AuthContext);
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
      <AdminUserDetails/>
      <AdminAddressChangeSection/>
      <AdminAccountDetailsUpdate/>
      <AdminChangeAccountPasswordSection/>
      <Footer/>
    </div>
  )
}

export default AdminAccountDetails;