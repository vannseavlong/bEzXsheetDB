import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import clsx from 'clsx';

export default function CategoryAndProductSelectionV2({
  categoryIds,
  productIds,
  optionIds,
  onCategoryIdsChange,
  onProductIdsChange,
  onOptionIdsChange,
  categoryNames = [],
  isPending,
  disabled
}: {
  categoryIds?: string[];
  productIds?: string[];
  optionIds?: string[];
  onCategoryIdsChange: (categoryIds: string[]) => void;
  onProductIdsChange: (productIds: string[]) => void;
  onOptionIdsChange: (optionIds: string[]) => void;
  categoryNames?: CategoryAttributes[];
  isPending: boolean;
  disabled?: boolean;
}) {
  const tempCategoryIds = categoryIds || [];
  const tempProductIds = productIds || [];
  const tempOptionIds = optionIds || [];

  if (isPending) return <div>loading...</div>;
  return (
    <div className="mt-6 space-y-6">
      {categoryNames?.map((item, index) => {
        return (
          <div key={index} className="flex flex-col">
            <div className="flex items-center gap-3">
              <Checkbox
                disabled={disabled}
                checked={tempCategoryIds.indexOf(String(item.id)) !== -1}
                onCheckedChange={() => {
                  if (tempCategoryIds.indexOf(String(item.id)) !== -1) {
                    onCategoryIdsChange(
                      tempCategoryIds.filter((id) => id !== String(item.id)) || []
                    );
                    onProductIdsChange(
                      tempProductIds.filter((id) => !item.products?.map((p) => p.id).includes(id))
                    );
                    onOptionIdsChange(
                      tempOptionIds.filter(
                        (id) =>
                          !item.products
                            ?.reduce(
                              (acc, p) => acc.concat(p.productOptionV2s?.map((o) => o.id) || []),
                              [] as string[]
                            )
                            .includes(id)
                      )
                    );
                  } else {
                    onCategoryIdsChange([...tempCategoryIds, String(item.id)]);
                  }
                }}
                id={item.nameEn || undefined}
              />
              <Label htmlFor={item.nameEn || undefined}>{item.nameEn}</Label>
            </div>
            <div
              className={clsx('pl-6 grid grid-cols-1 gap-4', {
                'mt-5': tempCategoryIds.indexOf(String(item.id)) !== -1,
                hidden: tempCategoryIds.indexOf(String(item.id)) === -1
              })}
            >
              {(item.products || []).map((product, index) => (
                <div key={index} className="flex flex-col">
                  <div
                    key={index}
                    className={clsx('flex items-center gap-3', {
                      hidden: tempCategoryIds.indexOf(String(item.id)) === -1
                    })}
                  >
                    <Checkbox
                      disabled={disabled}
                      checked={tempProductIds.indexOf(product.id) !== -1}
                      onCheckedChange={() => {
                        if (tempProductIds.indexOf(product.id) !== -1) {
                          onProductIdsChange(tempProductIds.filter((id) => id !== product.id));
                          onOptionIdsChange(
                            tempOptionIds.filter(
                              (id) => !product.productOptionV2s?.map((o) => o.id).includes(id)
                            )
                          );
                        } else {
                          onProductIdsChange([...tempProductIds, product.id]);
                        }
                        // if (productIdsSelected.indexOf(product.id) !== -1) {
                        //   setProductIdsSelected(
                        //     productIdsSelected.filter((id) => id !== product.id)
                        //   );
                        //   onOptionIdsChange(
                        //     tempOptionIds.filter(
                        //       (id) => !product.productOptionV2s?.map((o) => o.id).includes(id)
                        //     )
                        //   );
                        // } else {
                        //   setProductIdsSelected([...productIdsSelected, product.id]);
                        // }
                      }}
                      id={product.id}
                    />
                    <Label htmlFor={product.id}>{product.nameEn}</Label>
                  </div>
                  <div
                    className={clsx('pl-6 grid grid-cols-1 gap-4', {
                      'mt-5': tempProductIds.indexOf(product.id) !== -1
                    })}
                  >
                    {(product.productOptionV2s || []).map((option, index) => (
                      <div
                        key={index}
                        className={clsx('flex items-center gap-3', {
                          hidden: tempProductIds.indexOf(product.id) === -1
                        })}
                      >
                        <Checkbox
                          disabled={disabled}
                          checked={tempOptionIds.indexOf(option.id) !== -1}
                          onCheckedChange={() => {
                            if (tempOptionIds.indexOf(option.id) !== -1) {
                              onOptionIdsChange(tempOptionIds.filter((id) => id !== option.id));
                            } else {
                              onOptionIdsChange([...tempOptionIds, option.id]);
                            }
                          }}
                          id={option.id}
                        />
                        <Label htmlFor={option.id}>{option.nameEn}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
