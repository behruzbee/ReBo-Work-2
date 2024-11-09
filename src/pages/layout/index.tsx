import { Outlet } from 'react-router-dom'
import Header from '../../components/header'

import styles from './styles.module.scss'

const Layout = () => {
    return (
        <div className={styles.layout}>
            <Header />
            <Outlet />
        </div>
    )
}

export default Layout