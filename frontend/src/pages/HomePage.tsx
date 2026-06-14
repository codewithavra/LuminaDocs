
/**
 * Components
 */
import ChatWindow from '@/components/ChatWindow'
import HeaderSection from '@/components/HeaderSection'
import Sidebar from '@/components/Sidebar'
import TextBox from '@/components/TextBox'

/**
 * Store
 */


const HomePage = () => {

  return (
    <div className=' bg-background text-foreground overflow-hidden h-svh w-screen'>
      {/* Heading Section */}
      <HeaderSection title={null}/> // TODO : Change this
      {/* Sidebar */}
      <Sidebar/>
      {/* Text Box */}
      <TextBox />

      {/* Main Chat Area */}
      <div className='w-full h-full overflow-hidden flex justify-center items-center'>
        <ChatWindow />
      </div>
    </div>
  )
}

export default HomePage