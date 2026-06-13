
/**
 * Components
 */
import Sidebar from '@/components/Sidebar'
import TextBox from '@/components/TextBox'

const HomePage = () => {
  return (
    <div className=' bg-background text-foreground '>
      {/* Sidebar */}
      <Sidebar/>
      {/* Text Box */}
      <TextBox />
    </div>
  )
}

export default HomePage