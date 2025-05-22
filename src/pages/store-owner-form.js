import React, { useState } from "react";
import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import PageHeader from "@components/header/PageHeader";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { toast } from "react-toastify";
import requests from "@services/httpServices";
import { getUserSession } from "@lib/auth";
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
const PartnerRegistrationForm = () => {
  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting, loading, error } = useGetSetting();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userInfo = getUserSession();

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    mobile: userInfo?.phone || "",
    address: userInfo?.address || "",
    city:  "",
    state: "",
    pinCode: "",
    pan: "",
    aadhar: "",
    gst: "",
    designation: "StorePartner",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const result = await requests.post("/partners/partner/add", formData);
    console.log("store Owner api res ", result);

    // Web 3 form

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        ...formData,
      }),
    });
    const Web3FormResult = await response.json();
    console.log("Web3FormResult ", Web3FormResult);
    console.log("userInfo", userInfo);
    
    toast.success("Partner registration successful!");
    setFormData({
      name: userInfo?.name || "",
      email: userInfo?.email || "",
      mobile: userInfo?.phone || "",
      address: userInfo?.address || "",
      city: "",
      state: "",
      pinCode: "",
      pan: "",
      aadhar: "",
      gst: "",
      designation: "StorePartner",
    });
  } catch (error) {
    console.error("Error:", error);
    toast.error(error.response?.data?.message || "Something went wrong!");
  } finally {
    setIsSubmitting(false);
  }
};

  // Form field structure
  const formFields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      pattern: "^[a-zA-Z ]{3,50}$",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email address",
      pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
    },
    {
      name: "mobile",
      label: "Mobile Number",
      type: "tel",
      placeholder: "Enter your 10-digit mobile number",
      pattern: "^[0-9]{10}$",
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: "Enter your city",
    },
    {
      name: "state",
      label: "State",
      type: "text",
      placeholder: "Enter your state",
    },
    {
      name: "pinCode",
      label: "PIN Code",
      type: "text",
      placeholder: "Enter your 6-digit PIN code",
      pattern: "^[0-9]{6}$",
    },
    {
      name: "pan",
      label: "PAN Number",
      type: "text",
      placeholder: "Enter your PAN number",
      pattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
    },
    {
      name: "aadhar",
      label: "Aadhar Number",
      type: "text",
      placeholder: "Enter your 12-digit Aadhar number",
      // pattern: "^[0-9]{12}$"
    },
    {
      name: "gst",
      label: "GST Number",
      type: "text",
      placeholder: "Enter your GST number",
      // pattern: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Enter Your Address",
    },
  ];

  return (
    <Layout title="Partner Registration" description="Register as a partner">
      <PageHeader
        headerBg={storeCustomizationSetting?.term_and_condition?.header_bg}
        title="Partner Registration Form"
      />
      {loading ? (
        <CMSkeleton />
      ) : (
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-customPink px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                Register as a Store Owner
              </h2>
              <p className="text-indigo-100 mt-1 text-sm">
                Fill in the details below to join our partner network
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.map((field) => (
                  <div
                    key={field.name}
                    className={
                      field.name === "designation" ? "md:col-span-2" : ""
                    }
                  >
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.label}
                    </label>

                    {field.type === "select" ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        pattern={field.pattern}
                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                          field.name === "name" ||
                          field.name === "email" ||
                          field.name === "mobile"
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                        required
                        readOnly={
                          field.name === "name" ||
                          field.name === "email" ||
                          field.name === "mobile"
                        }
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center md:justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      name: userInfo?.name || "",
                      email: userInfo?.email || "",
                      mobile: userInfo?.phone || "",
                      address: userInfo?.address || "",
                      city: "",
                      state: "",
                      pinCode: "",
                      pan: "",
                      aadhar: "",
                      gst: "",
                      designation: "StorePartner",
                    })
                  }
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md mr-4"
                  disabled={isSubmitting}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-customPink hover:bg-customPinkDark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customPink disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Register Partner"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PartnerRegistrationForm;
