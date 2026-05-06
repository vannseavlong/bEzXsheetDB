// import React from 'react';
// import { Button } from '../ui/button';
// import PopUpUI from './pop-up-ui';
// import { usePopupDialog } from '@/hooks/usePopupDialog';

// type Props = {
//   order: OrderListAttributes;
//   onPrintClick: () => void;
// };

// const OrderHeaderDetail: React.FC<Props> = ({ onPrintClick, order }) => {
//   const {
//     popupId,
//     openDialog,
//     closeDialog,
//     handleConfirm: popupConfirm,
//     isOpen
//   } = usePopupDialog();

//   const [pickedUp, setPickedUp] = React.useState(false);
//   const [cancel, setCancel] = React.useState(false);
//   const [complete, setCompleted] = React.useState(false);

//   // Status variant mapping
//   // const variant: Record<string, "default" | "destructive" | "success" | "outline"> = {
//   //   PENDING: "default",
//   //   IN_PROGRESS: "outline",
//   //   COMPLETED: "success",
//   //   CANCELLED: "destructive",
//   // };

//   // Dynamic button config
//   const buttonConfig: Record<
//     string,
//     { text: string; variant: 'default' | 'destructive' | 'success' | 'outline'; action: () => void }
//   > = {
//     PENDING: pickedUp
//       ? cancel
//         ? {
//             text: 'Refund',
//             variant: 'default',
//             action: () => openDialog('Refund')
//           }
//         : {
//             text: 'Cancel Order',
//             variant: 'destructive',
//             action: () => openDialog('CancelOrder')
//           }
//       : {
//           text: 'Pick Up',
//           variant: 'default',
//           action: () => openDialog('Pickup')
//         },
//     IN_PROGRESS: {
//       text: 'Submit',
//       variant: 'outline',
//       action: () => openDialog('Submit')
//     },
//     COMPLETED: complete
//       ? {
//           text: 'Edit',
//           variant: 'default',
//           action: () => openDialog('EditCompleted') // new dialog for edit
//         }
//       : {
//           text: 'Mark as Complete',
//           variant: 'success',
//           action: () => openDialog('MarkComplete')
//         },

//     CANCELLED: cancel
//       ? {
//           text: 'Cancel Order',
//           variant: 'default',
//           action: () => openDialog('CancelOrder')
//         }
//       : {
//           text: 'Refund',
//           variant: 'default',
//           action: () => openDialog('Refund')
//         }
//   };

//   // Status badge colors
//   const getStatusColor = (
//     status?: 'PENDING' | 'COMPLETED' | 'IN_PROGRESS' | 'ACCEPTED' | 'CANCELLED'
//   ) => {
//     switch (status) {
//       case 'PENDING':
//         return 'text-[12px] font-semibold bg-[#FEF7E9] text-[#F6B024]';
//       case 'COMPLETED':
//         return 'text-[12px] font-semibold bg-[#E6F9F1] text-[#06C270]';
//       case 'IN_PROGRESS':
//         return 'text-[12px] font-semibold bg-[#E8F0F7] text-[#102C90]';
//       case 'ACCEPTED':
//         return 'text-[12px] font-semibold bg-[#E0F7FA] text-[#0288D1]';
//       case 'CANCELLED':
//         return 'text-[12px] font-semibold bg-[#FFEBEB] text-[#FF3B3B]';
//       default:
//         return 'text-[12px] font-semibold bg-gray-100 text-gray-600';
//     }
//   };

//   const status = order.status ?? 'PENDING';

//   const handleConfirm = (inputValue?: string) => {
//     if (popupId === 'Pickup') setPickedUp(true);
//     if (popupId === 'CancelOrder') setCancel(true);
//     if (popupId === 'Refund') {
//       setPickedUp(false);
//       setCancel(false);
//     }
//     if (popupId === 'MarkComplete') setCompleted(true);
//     if (popupId === 'EditCompleted') {
//       setCompleted(false);
//     }

//     popupConfirm?.(inputValue);
//     closeDialog();
//   };

//   return (
//     <div className="h-[88px] w-full items-center flex px-6 bg-background">
//       {/* Order ID and Status */}
//       <div className="flex space-x-4 items-center">
//         <h2 className="text-base font-semibold">
//           Order ID <span className="font-bold">#{order.bulkOrderId}</span>
//         </h2>
//         <div className="h-5 w-px bg-gray-300" />
//         <span
//           className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
//         >
//           {order.status || 'Unknown'}
//         </span>
//       </div>

//       {/* Dynamic Buttons */}
//       <div className="flex items-center gap-3 ml-auto">
//         <button
//           onClick={onPrintClick}
//           className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-100 h-[36px]"
//         >
//           <PrinterIcon size={24} color="#000000" strokeWidth={1.5} className="w-4 h-4" />
//           Print
//         </button>

//         {buttonConfig[status] && (
//           <Button
//             variant={buttonConfig[status].variant}
//             onClick={buttonConfig[status].action}
//             className="h-[36px]"
//           >
//             {buttonConfig[status].text}
//           </Button>
//         )}
//       </div>

//       {/* Popup Dialog */}
//       {isOpen && popupId && (
//         <PopUpUI popupId={popupId} open={isOpen} onClose={closeDialog} onConfirm={handleConfirm} />
//       )}
//     </div>
//   );
// };

// export default OrderHeaderDetail;
