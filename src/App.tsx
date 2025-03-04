import { yupResolver } from "@hookform/resolvers/yup";
import "./App.css";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  UserName: yup
    .string()
    .required("Input can't be empty")
    .min(5, "Name must be at least 5 characters")
    .test(
      "includes-space",
      "There must be space between names",
      (value) => !!value && value.includes(" ")
    ),
  CardNumber: yup
    .string()
    .required("Card number is required")
    .min(15, "Card number must be at least 15 characters")
    .max(19, "Card number must be at most 19 characters"),
  MM: yup.string().required("Input can't be empty"),
  YY: yup.string().required("Input can't be empty"),
  Cvc: yup.string().required("Input can't be empty"),
});

function App() {
  interface Inputs {
    UserName: string;
    CardNumber: string;
    MM: string;
    YY: string;
    Cvc: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <>
      <div>
        <h2>{errors.UserName && "UserName Error"}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor='UserName'>UserName</label>
          <input
            type='text'
            id='UserName'
            {...register("UserName")}
          />
          {errors.UserName && <p>{errors.UserName.message}</p>}

          <label htmlFor='CardNumber'>CardNumber</label>
          <input
            type='text'
            id='CardNumber'
            {...register("CardNumber")}
          />
          {errors.CardNumber && <p>{errors.CardNumber.message}</p>}

          <label htmlFor='MM'>MM</label>
          <input type='text' id='MM' {...register("MM")} />
          {errors.MM && <p>{errors.MM.message}</p>}

          <label htmlFor='YY'>YY</label>
          <input type='text' id='YY' {...register("YY")} />
          {errors.YY && <p>{errors.YY.message}</p>}

          <label htmlFor='Cvc'>Cvc</label>
          <input type='text' id='Cvc' {...register("Cvc")} />
          {errors.Cvc && <p>{errors.Cvc.message}</p>}

          <button type='submit'>Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;
