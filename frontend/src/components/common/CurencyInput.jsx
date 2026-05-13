import { NumericFormat } from "react-number-format";
import { Input } from "../ui/input";

const CurrencyInput = ({
  value = "",
  onValueChange = () => {},
  className,
  ...props
}) => {
  return (
    <NumericFormat
      className={className}
      {...props}
      customInput={Input}
      value={value}
      thousandSeparator="." // Dấu phân cách hàng nghìn (kiểu VN)
      decimalSeparator="," // Dấu phân cách thập phân
      suffix={" đ"} // Đơn vị đứng sau
      allowNegative={false} // Không cho phép số âm
      // Tối đa 2 chữ số sau dấu phẩy
      // fixedDecimalScale // Luôn hiển thị đủ số thập phân (ví dụ .00)
      onValueChange={(values) => {
        const { formattedValue, value, floatValue } = values;
        // formattedValue: "2.500.000,00 ₫" (Dành cho hiển thị UI)
        // value: "2500000" (Dạng chuỗi)
        // floatValue: 2500000 (Dạng số thuần - Dùng để lưu Database)
        onValueChange({ formattedValue, value, floatValue });
      }}
    />
  );
};

export default CurrencyInput;
