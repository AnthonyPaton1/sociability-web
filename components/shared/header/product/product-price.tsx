import { cn } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  //ensure tw decimal places
  const stringvalue = value.toFixed(2);
  //get int/float
  const [intValue, floatVal] = stringvalue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">£</span>
      {intValue}
      <span className="text-xs align-super">.{floatVal}</span>
    </p>
  );
};

export default ProductPrice;
