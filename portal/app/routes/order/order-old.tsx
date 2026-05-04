// import OrderComponent from '@/components/common/order-component';
// import { servicesData } from '@/constants/data-dummy';
// import { serviceDetailsDummy } from '@/constants/data-dummy';
// import ServiceDetails from '@/components/common/Service-details-component';
// import { useState } from 'react';
// import OrderAssignCleaner from '@/components/common/order-assign-cleaner';
// import OrderDetailCard from '@/components/common/order-detail-card';
// import CategorySearchInterface from '@/components/category/Category-search-interface';
// import PaginationDemo from '@/components/common/Pagination-component';
// import ServiceCardInProgress from '@/components/common/order-in-progress-service';
// import useOrderQuery from '@/hooks/use-order-query';
// import useOrderDetailQuery from '@/hooks/use-order-detail-query';
// import { Skeleton } from '@/components/ui/skeleton';
// import OrderHeader from '@/components/order/order-header';
// import OrderHeaderDetail from '@/components/common/order-detail-header';

// export default function OrdersList() {
//   const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);
//   const [currentPage, setCurrentPage] = useState(1);

//   const { data: ordersData, isPending } = useOrderQuery({
//     currentPage: currentPage - 1
//   });
//   const { data: orderDetailData } = useOrderDetailQuery(selectedOrderId);

//   if (isPending)
//     return (
//       <div className="flex items-center space-x-4 p-6">
//         <Skeleton className="h-12 w-12 rounded-full" />
//         <div className="space-y-2">
//           <Skeleton className="h-4 w-[250px]" />
//           <Skeleton className="h-4 w-[200px]" />
//         </div>
//       </div>
//     );

//   const ordersArray: Order[] = ordersData?.data || [];

//   const selectedOrder =
//     ordersArray.find(
//       (order: { bulkOrderId: string | undefined }) => order.bulkOrderId === selectedOrderId
//     ) || null;

//   const renderServiceDetailsByStatus = () => {
//     switch (selectedOrder?.status) {
//       case 'PENDING':
//       case 'IN_PROGRESS':
//       case 'ACCEPTED':
//         return <ServiceDetails {...serviceDetailsDummy} />;
//       case 'COMPLETED':
//         return <ServiceCardInProgress services={servicesData} />;
//       default:
//         return <></>;
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="flex flex-col w-[400px] bg-white">
//         <OrderHeader />
//         <div className="flex-1 flex flex-col overflow-auto px-4 py-3">
//           <CategorySearchInterface />

//           <div className="flex flex-col gap-2 mt-3">
//             {ordersArray.map((order, index: number) => (
//               <div
//                 key={order.bulkOrderId ?? `order-${index}`}
//                 className="flex items-center gap-3 cursor-pointer"
//                 onClick={() => order.bulkOrderId && setSelectedOrderId(order.bulkOrderId)}
//               >
//                 <OrderComponent
//                   {...order}
//                   isActive={selectedOrderId === order.bulkOrderId}
//                   onClick={setSelectedOrderId}
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="mt-auto pt-4">
//             <PaginationDemo
//               currentPage={ordersData?.pagination?.currentPage || 1}
//               totalPages={ordersData?.pagination?.totalPages || 1}
//               onPageChange={setCurrentPage}
//             />
//           </div>
//         </div>
//       </div>

//       {/* RIGHT CONTENT */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="p-6 border-b bg-white shrink-0">
//           {selectedOrder && (
//             <OrderHeaderDetail
//               bulkOrderId={selectedOrder.bulkOrderId}
//               status={selectedOrder.status}
//               buttonText={selectedOrder.status}
//             />
//           )}
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 overflow-y-auto bg-background p-6">
//           {selectedOrder ? (
//             <>
//               {orderDetailData ? (
//                 <OrderDetailCard data={orderDetailData} />
//               ) : (
//                 <div className="flex items-center space-x-4 p-4">
//                   <Skeleton className="h-12 w-12 rounded-full bg-white shadow" />
//                   <div className="space-y-2 flex-1">
//                     <Skeleton className="h-4 w-full max-w-[250px] bg-white shadow" />
//                     <Skeleton className="h-4 w-full max-w-[250px] bg-white shadow" />
//                   </div>
//                 </div>
//               )}

//               {/* Services + Cleaner Assignment */}
//               <div className="flex flex-col md:flex-row gap-6 mt-6">
//                 <div className="flex-1">{renderServiceDetailsByStatus()}</div>
//                 {orderDetailData && <OrderAssignCleaner data={orderDetailData} />}
//               </div>
//             </>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-gray-500 text-lg font-medium">Select an order to see details</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
