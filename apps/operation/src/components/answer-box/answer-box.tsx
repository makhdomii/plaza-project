import classname from 'classnames';
import styles from './styles.module.scss';
type AnswerBoxType = {
  red: number;
  blue: number;
  title: string;
};
export const AnswerBox = ({ blue, red, title }: AnswerBoxType) => {
  return (
    <div className={classname(styles['answer-box'])}>
      <p>{title}</p>
      <div className={classname(styles['answer-box-numbers'])}>
        <p className={styles['answer-box-red']}>{red}</p>
        <p className={styles['answer-box-blue']}>{blue}</p>
      </div>
    </div>
  );
};
