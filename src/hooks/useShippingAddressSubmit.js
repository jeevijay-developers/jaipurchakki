import { notifyError, notifySuccess } from "@utils/toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

//internal import
import { getUserSession } from "@lib/auth";
import { countries } from "@utils/countries";
import CustomerServices from "@services/CustomerServices";
import requests from "@services/httpServices";

const useShippingAddressSubmit = (id) => {
  const router = useRouter();
  // const [cities, setCities] = useState([]);
  // const [areas, setAreas] = useState([]);
  const [zipCodes, setZipCodes] = useState([]);
  const [selectedValue, setSelectedValue] = useState({
    country: "",
    zipCode: "",
    // city: "",
    // area: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userInfo = getUserSession();

  // const { handlerTextTranslateHandler } = useTranslationValue();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await requests.get("/tele/get/pincodes");
        console.log("result", result.message);
        setZipCodes(result.message);
      } catch (error) {
        console.error("Error fetching pincodes:", error);
      }
    };

    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    // clearErrors,
    // reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (
      !selectedValue?.country ||
      //  !selectedValue?.city ||
      //  !selectedValue?.area
      !selectedValue?.zipCode
    ) {
      return notifyError("Country & zip Code is required!");
    }
    setIsSubmitting(true);
    try {
      const res = await CustomerServices.addShippingAddress({
        userId: userInfo?.id,
        shippingAddressData: {
          ...data,
          country: selectedValue.country,
          zipCode: selectedValue.zipCode,
          // city: selectedValue.city,
          // area: selectedValue.area,
        },
      });

      notifySuccess(res.message);
      setIsSubmitting(false);
      router.push("/user/my-account");

      // console.log("onSubmit", data);
    } catch (err) {
      setIsSubmitting(false);
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  const handleInputChange = (name, value) => {
    // console.log("handleInputChange", name, "value", value);
    setSelectedValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // if (name === "country") {
    //   const result = countries?.find(
    //     (country) => country?.name === value
    //   ).cities;
    //   setCities(result);
    //   setAreas([]);
    // }

    // if (name === "city") {
    //   const result = cities?.find((city) => city?.name === value).areas;
    //   setAreas(result);
    // }

    // if (name === "zipCode") {
    //   const result = zipCode?.find((data) => data?.name === value);
    //   ZipCode(result);
    // }
  };

  const { data, isFetched } = useQuery({
    queryKey: ["shippingAddress", { id: userInfo?.id }],
    queryFn: async () =>
      await CustomerServices.getShippingAddress({
        userId: userInfo?.id,
      }),
    select: (data) => data?.shippingAddress,
  });

  useEffect(() => {
    if (isFetched && data) {
      setValue("name", data.name);
      setValue("address", data.address);
      setValue("contact", data.contact);
      setValue("email", data.email || userInfo?.email);
      setValue("country", data.country);
      setValue("city", data.city);
      setValue("area", data.area);
      setValue("zipCode", data.zipCode);
      setSelectedValue({
        country: data.country,
        zipCode: data.zipCode,
        // city: data.city,
        // area: data.area,
      });
      // setCities([
      //   {
      //     name: data.city,
      //   },
      // ]);
      // setAreas([data.area]);
    } else {
      setValue("email", userInfo?.email);
    }
  }, [data]);

  return {
    register,
    onSubmit,
    errors,
    // cities,
    // areas,
 
    zipCodes,
    setValue,
    handleSubmit,
    selectedValue,
    isSubmitting,
    handleInputChange,
  };
};

export default useShippingAddressSubmit;
