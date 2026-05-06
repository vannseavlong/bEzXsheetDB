type Props = {
  service_category: string;
  add_on_count: string;
  price: number;
  img_url: string;
};

export default function OrderServiceIcon({
  service_category,
  add_on_count,
  price,
  img_url
}: Props) {
  return (
    <div className="flex items-center justify-between w-[572px] h-12 ">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12  bg-blue-100 rounded-[30px] flex items-center justify-center">
          <span className="text-blue-500"> {img_url}</span>
        </div>
        <div>
          <span className="text-gray-900 text-lg font-medium">{service_category}</span>
          <span className="text-gray-500 text-sm ml-1">({add_on_count} )</span>
        </div>
      </div>
      <span className="text-gray-900 text-xl font-bold">${price}</span>
    </div>
  );
}
