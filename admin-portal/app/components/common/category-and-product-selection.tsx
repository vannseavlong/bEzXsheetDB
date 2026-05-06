import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function CategoryAndProductSelection({
  productIds,
  optionIds,
  onProductIdsChange,
  onOptionIdsChange,
  defaultCategoryIds = [],
  categoryNames = [],
  isPending,
  disabled
}: {
  productIds?: string[];
  optionIds?: string[];
  onProductIdsChange: (productIds: string[]) => void;
  onOptionIdsChange: (optionIds: string[]) => void;
  defaultCategoryIds?: unknown[];
  categoryNames?: CategoryAttributes[];
  isPending: boolean;
  disabled?: boolean;
}) {
  const [categoryIdsSelected, setCategoryIdsSelected] = useState<unknown[]>([]);

  useEffect(() => {
    if (categoryNames) setCategoryIdsSelected(defaultCategoryIds);
  }, [categoryNames, defaultCategoryIds]);

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
                checked={categoryIdsSelected.indexOf(item.id) !== -1}
                onCheckedChange={() => {
                  if (categoryIdsSelected.indexOf(item.id) !== -1) {
                    setCategoryIdsSelected(categoryIdsSelected.filter((id) => id !== item.id));
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
                    setCategoryIdsSelected([...categoryIdsSelected, item.id]);
                  }
                }}
                id={item.nameEn || undefined}
              />
              <Label htmlFor={item.nameEn || undefined}>{item.nameEn}</Label>
            </div>
            <div
              className={clsx('pl-6 grid grid-cols-1 gap-4', {
                'mt-5': categoryIdsSelected.indexOf(item.id) !== -1,
                hidden: categoryIdsSelected.indexOf(item.id) === -1
              })}
            >
              {(item.products || []).map((product, index) => (
                <div key={index} className="flex flex-col">
                  <div
                    key={index}
                    className={clsx('flex items-center gap-3', {
                      hidden: categoryIdsSelected.indexOf(item.id) === -1
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
