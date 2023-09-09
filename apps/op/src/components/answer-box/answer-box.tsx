import classname from 'classnames';
import styles from './styles.module.scss';
type AnswerBoxType = {
  red: number;
  blue: number;
  title: string;
};
export const AnswerBox = ({ blue, red, title }: AnswerBoxType) => {
  return (
    <div className={classname('md:w-1/3 w-1/6 px-3', styles['answer-box'])}>
      <p className="text-lg pb-3 text-center">{title}</p>
      <div
        className={classname(
          ' rounded-md overflow-hidden',
          styles['answer-box-numbers']
        )}
      >
        <p className={styles['answer-box-blue']}>{blue}</p>
        <p className={styles['answer-box-red']}>{red}</p>
      </div>
    </div>
  );
};
