import { FormEvent } from 'react';

type RefereeBoxType = {
  submitText: (e: FormEvent<EventTarget>) => void;
  submitTimer: (e: FormEvent<EventTarget>) => void;
  id: number;
};
export const RefereeBox = ({ submitText, submitTimer, id }: RefereeBoxType) => {
  return (
    <div className="text-right pl-4 w-1/4">
      <p className="py-5 text-xl">کاربر شماره {id}</p>
      <form onSubmit={submitTimer}>
        <p>زمان</p>
        <div className="flex relative">
          <input
            className="w-1/2 border text-center text-slate-900 border-sky-400 rounded-md py-3 px-5 my-2"
            name="minutes"
            type="number"
            placeholder="دقیقه"
          />
          <input
            className="w-1/2 border text-center text-slate-900 border-sky-400 rounded-md py-3 px-5 my-2 ml-1"
            name="seconds"
            type="number"
            placeholder="ثانیه"
          />
        </div>
        <button
          className="rounded-md bg-emerald-600 text-emerald-50 py-3 px-6"
          type="submit"
        >
          شروع زمان
        </button>
      </form>

      <form className="pt-7" onSubmit={submitText}>
        <p>چت</p>
        <input
          className="w-full border border-sky-400 rounded-md py-3 px-5 my-2"
          name="textBox"
          type="text"
        />
        <button
          className="rounded-md bg-emerald-600 text-emerald-50 py-3 px-6"
          type="submit"
        >
          ارسال
        </button>
      </form>
    </div>
  );
};
