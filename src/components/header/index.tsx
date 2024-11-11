import { NavLink } from 'react-router-dom'
import styles from './styles.module.scss'

const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <h1>
                    <NavLink to="/">ReBo</NavLink>
                </h1>
            </div>

            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <NavLink to="/tasks" className={styles.nav_link}>VAZIFALAR</NavLink>
                </li>
                <li className={styles.listItem}>
                    <NavLink to="/workers" className={styles.nav_link}>ISHCHILAR</NavLink>
                </li>
                <li className={styles.listItem}>
                    <NavLink to="/histories" className={styles.nav_link}>ISTORIYA</NavLink>
                </li>
                <li className={styles.listItem}>
                    <NavLink to="/penalties" className={styles.nav_link}>JARIMALAR</NavLink>
                </li>
            </ul>
        </div>
    )
}

export default Header