import { redirect } from "next/navigation";

export default function AuthCallback() {
  // აქ შესაძლებელია ტოკენის დამუშავება, თუ საჭირო იქნება.
  redirect("/protected"); // მაგალითად, ავთენტიფიცირებული მომხმარებლის გადამისამართება.
}
