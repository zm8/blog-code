import styles from './App.scss';
import Test from './1';

export default function App(){
    return <div className={styles.a}>
        <div className="b">
            Hello World1
        </div>
        <Test />
    </div>
}