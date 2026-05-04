export default function EditVoucher({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Voucher Edition</h1>
      <p>{params.id}</p>
    </div>
  );
}
