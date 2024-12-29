import statisticApiRequests from "@/apiRequests/statistic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { UserActionType } from "@/schemaValidations/statistic.schema";

export default async function UserActionsTable() {
  const { payload: userActions } = await statisticApiRequests.getUserActions();

  return (
    <Table className="text-center border">
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow className="bg-primary-foreground">
          <TableHead className="text-center">#</TableHead>
          <TableHead className="ps-10">Hành động</TableHead>
          <TableHead className="text-center">Thời gian</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userActions.map((userAction: UserActionType, index) => (
          <TableRow key={userAction.id}>
            <TableCell>{`${index + 1}.`}</TableCell>
            <TableCell className="text-left ps-10">
              {userAction.fullName + " " + userAction.actionName}
            </TableCell>
            <TableCell>{formatDate(userAction.timestamp)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
