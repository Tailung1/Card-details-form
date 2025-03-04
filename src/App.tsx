import { yupResolver } from "@hookform/resolvers/yup";
import "./App.css";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import IMask from "imask";
import { useEffect, useRef } from "react";

// Luhn Algorithm for credit card validation
const luhnCheck = (cardNumber: string) => {
  let sum = 0;
  let shouldDouble = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

// Check card type based on prefixes (Visa, MasterCard, American Express)
const getCardType = (cardNumber: string) => {
  const visaPattern = /^4/;
  const masterCardPattern = /^5[1-5]/;
  const amexPattern = /^3[47]/;
  if (visaPattern.test(cardNumber)) return "Visa";
  if (masterCardPattern.test(cardNumber)) return "MasterCard";
  if (amexPattern.test(cardNumber)) return "American Express";
  return "Unknown";
};

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
    .transform((value) => value.replace(/\s+/g, ""))
    .min(15, "Card number must be at least 15 characters")
    .max(19, "Card number must be at most 19 characters")
    .test(
      "card-number-format",
      "Card number must be a valid format",
      (value) => /^[0-9]{15,19}$/.test(value)
    )
    .test(
      "luhn-check",
      "Card number is invalid. Please check the number.",
      (value) => luhnCheck(value)
    )
    .test("card-type", "Unsupported card type", (value) => {
      const cardType = getCardType(value);
      return cardType !== "Unknown";
    }),
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
    watch,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<Inputs>({ resolver: yupResolver(schema) });

  const cardNumberRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (cardNumberRef.current) {
      const mask = IMask(cardNumberRef.current, {
        mask: "0000 0000 0000 0000", // Card number mask
      });

      cardNumberRef.current.addEventListener("input", () => {
        setValue("CardNumber", cardNumberRef.current?.value || "");
        trigger("CardNumber"); // Trigger validation on input change
      });

      return () => {
        mask.destroy();
      };
    }
  }, [setValue, trigger]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <>
      <div>
        <h2>{watch("UserName") || "JANE APPLESEED"}</h2>
        <h2>{watch("CardNumber") || "0000 0000 0000 0000"}</h2>
        <h3>{watch("MM") || "00"}</h3>
        <h3>{watch("YY") || "00"}</h3>
        <h3>{watch("Cvc") || "000"}</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor='UserName'>UserName</label>
        <input
          type='text'
          id='UserName'
          placeholder='e.g. Jane Appleseed'
          {...register("UserName")}
        />
        {errors.UserName && <p>{errors.UserName.message}</p>}

        <label htmlFor='CardNumber'>CardNumber</label>
        <input
          type='text'
          id='CardNumber'
          placeholder='e.g. 1234 5678 9123 0000'
          {...register("CardNumber")}
          ref={cardNumberRef}
        />
        {errors.CardNumber && <p>{errors.CardNumber.message}</p>}

        <label htmlFor='MM'>MM</label>
        <input
          type='text'
          id='MM'
          placeholder='MM'
          {...register("MM")}
        />
        {errors.MM && <p>{errors.MM.message}</p>}

        <label htmlFor='YY'>YY</label>
        <input
          type='text'
          id='YY'
          placeholder='YY'
          {...register("YY")}
        />
        {errors.YY && <p>{errors.YY.message}</p>}

        <label htmlFor='Cvc'>Cvc</label>
        <input
          type='text'
          id='Cvc'
          placeholder='e.g. 123'
          {...register("Cvc")}
        />
        {errors.Cvc && <p>{errors.Cvc.message}</p>}

        <button type='submit'>Submit</button>
      </form>
    </>
  );
}

export default App;
