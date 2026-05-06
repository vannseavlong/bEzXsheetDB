import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import React from 'react';
import useLanguage from '@/hooks/use-language';
import { getLocalizedTaskInfo } from '@/lib/language-helper';
import Icon from '@/assets/icons/icon-asset';
import useProductDetailWithCategoryQuery from '@/hooks/use-product-detail-with-taskinfo-query';
import { useTranslation } from 'node_modules/react-i18next';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
};

const TaskInfoDialog: React.FC<Props> = ({ open, onOpenChange, productId }) => {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const { data: productDetail, isLoading } = useProductDetailWithCategoryQuery(productId ?? '');

  const taskInfo = React.useMemo(() => {
    if (!productDetail) return undefined;

    if (productDetail.taskInfoEn && productDetail.taskInfoEn.length > 0) {
      return {
        taskInfoEn: productDetail.taskInfoEn,
        taskInfoKm: productDetail.taskInfoKm || [],
        taskInfoCn: productDetail.taskInfoCn || [],
        taskInfoTw: productDetail.taskInfoTw || [],
        taskInfoVi: productDetail.taskInfoVi || []
      };
    }

    if (productDetail.category?.taskInfoEn && productDetail.category.taskInfoEn.length > 0) {
      return {
        taskInfoEn: productDetail.category.taskInfoEn,
        taskInfoKm: productDetail.category.taskInfoKm || [],
        taskInfoCn: productDetail.category.taskInfoCn || [],
        taskInfoTw: productDetail.category.taskInfoTw || [],
        taskInfoVi: productDetail.category.taskInfoVi || []
      };
    }

    return undefined;
  }, [productDetail]);

  const currentTaskInfo = React.useMemo(() => {
    return taskInfo ? getLocalizedTaskInfo(taskInfo, currentLang) : [];
  }, [taskInfo, currentLang]);

  React.useEffect(() => {
    if (open) {
      setSelectedTabIndex(0);
    }
  }, [open, currentTaskInfo]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[45vh] rounded-t-2xl flex flex-col bg-white">
        <div className="px-4 bg-white rounded-t-2xl flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="text-center text-lg font-bold mt-4 mb-2">
              {t('service.taskInformation')}
            </SheetTitle>
          </SheetHeader>

          {isLoading ? (
            <div className="text-center py-8 flex-1 overflow-y-auto">
              <p className="text-gray-500">{t('common.loading')}</p>
            </div>
          ) : currentTaskInfo.length > 0 ? (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex space-x-4 mt-4 mb-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden flex-shrink-0">
                {currentTaskInfo.map((section, index) => (
                  <div key={index} className="relative">
                    {selectedTabIndex === index ? (
                      <div className="p-[1px] rounded-full bg-gradient-to-r from-[#102C90] to-[#1B4CFA]">
                        <button
                          onClick={() => setSelectedTabIndex(index)}
                          className="w-full h-full px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 bg-[#E3F2FD] flex justify-center items-center">
                          <span className="bg-gradient-to-r from-[#102C90] to-[#1B4CFA] bg-clip-text text-transparent font-semibold">
                            {section.key}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedTabIndex(index)}
                        className="px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 flex justify-center items-center">
                        <span>{section.key}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {currentTaskInfo[selectedTabIndex] && (
                <div className="space-y-3 overflow-y-auto pb-[50px] flex-1">
                  {currentTaskInfo[selectedTabIndex].value.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <Icon name="starIcon" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed flex-1">
                          {item.replace(/^•\s*/, '')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 flex-1 overflow-y-auto">
              <p className="text-gray-500">{t('taskInfo.noTaskInfoAvailable')}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskInfoDialog;
