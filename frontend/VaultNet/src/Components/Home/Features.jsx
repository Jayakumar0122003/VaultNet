import { CreditCard, ShieldCheck } from "lucide-react";
import { RiBankFill } from "react-icons/ri";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const solutions = [
  {
    icon: <CreditCard className="h-8 w-8 text-white" />,
    title: "Free Transfers",
    description:
      "Enjoy seamless and cost-effective banking with our free transfers service, designed to your transactions.",
  },
  {
    icon: <RiBankFill className="h-8 w-8 text-white" />,
    title: "Multiple Account",
    description:
      "Streamline your finances with our multiple account management service, allowing you to manage all your accounts.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-white" />,
    title: "Unmatched Security",
    description:
      "Your financial security is our top priority. Our unmatched security service offers state-of-the-art protection.",
  },
];

export default function Features() {
  return (
    <section className="bg-sec py-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Animated Header */}
        <motion.div
          className="text-center md:flex md:justify-between md:items-start mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="md:w-1/2 text-left">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Comprehensive Personal <br />
              Banking Solutions
            </h2>
          </div>
          <div className="md:w-1/2 text-gray-600 text-lg">
            Our comprehensive banking services are designed to cater to your every
            financial need. Whether you're an individual looking for savings
            options, a business seeking tailored financial solutions.
          </div>
        </motion.div>

        {/* Animated Features */}
        <div className="grid md:grid-cols-3 gap-8 pt-10">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              className={`flex flex-col gap-4 text-center md:text-left px-4 ${
                index !== 2 ? "md:border-r border-main" : ""
              }`}
              
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-main w-14 h-14 rounded-md flex items-center justify-center mx-auto md:mx-0">
                {solution.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {solution.title}
              </h3>
              <p className="text-gray-600 text-sm">{solution.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
