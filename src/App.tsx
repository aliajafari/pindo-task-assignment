import TreeNode from '@/components/tree/Tree'
import AppStyles from './App.module.css'
function App() {
  return (
    <div className={AppStyles.container}>
    <div className={AppStyles.app}>
      <TreeNode />
    </div>
    </div>
  )
}

export default App
