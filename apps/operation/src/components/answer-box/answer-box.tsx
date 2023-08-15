import classname from 'classnames';
import styles from './styles.module.scss';
type AnswerBoxType = {
  red: number;
  blue: number;
  title: string;
};
export const AnswerBox = ({ blue, red, title }: AnswerBoxType) => {
  return (
    <div className={classname('w-1/3 px-3',styles['answer-box'])}>
      <p className='text-red-50'>{title}</p>
      <div className={classname(' rounded-md overflow-hidden',styles['answer-box-numbers'])}>
        <p className={styles['answer-box-red']}>{red}</p>
        <p className={styles['answer-box-blue']}>{blue}</p>
      </div>
    </div>
  );
};
