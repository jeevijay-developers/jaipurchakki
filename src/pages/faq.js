import React from "react";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

// Internal imports
import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import PageHeader from "@components/header/PageHeader";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Faq = () => {
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  // Extract FAQs into a reusable list
  const faqs = Array.from({ length: 10 }, (_, index) => {
    const number = [
      "one", "two", "three", "four", "five",
      "six", "seven", "eight", "nine", "ten"
    ][index];

    const questionKey = `faq_${number}`;
    const answerKey = `description_${number}`;

    const question = showingTranslateValue(storeCustomizationSetting?.faq?.[questionKey]);
    const answer = showingTranslateValue(storeCustomizationSetting?.faq?.[answerKey]);

    // Only return if both question and answer are present
    if (question && answer) {
      return { question, answer };
    }

    return null;
  }).filter(Boolean); // remove null entries

  return (
    <Layout title="FAQ" description="This is faq page">
      <PageHeader
        headerBg={storeCustomizationSetting?.faq?.header_bg}
        title={showingTranslateValue(storeCustomizationSetting?.faq?.title)}
      />
      <div className="bg-white">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 py-10 lg:py-12">
          <div className="grid gap-4 lg:mb-8 items-center md:grid-cols-2 xl:grid-cols-2">
            {/* Left Image */}
            <div className="pr-16">
              <Image
                width={720}
                height={550}
                src={storeCustomizationSetting?.faq?.left_img || "/faq.svg"}
                alt="FAQ"
              />
            </div>

            {/* Right - FAQs */}
            <div>
              {faqs.map((faq, idx) => (
                <Disclosure key={idx} as="div" className={idx !== 0 ? "mt-2" : ""}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-base font-medium text-left text-gray-600 focus:text-emerald-500 bg-gray-50 hover:bg-emerald-50 rounded-lg focus:outline-none">
                        <span>{faq.question}</span>
                        <ChevronUpIcon
                          className={`${
                            open ? "transform rotate-180 text-emerald-500" : ""
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-3 pb-8 text-sm leading-7 text-gray-500">
                        {faq.answer}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Faq;
