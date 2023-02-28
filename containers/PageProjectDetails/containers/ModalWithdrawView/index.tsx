import cx from "classnames";
import moment from "moment";
import { Modal } from "semantic-ui-react";

import IconClose from "./components/IconClose";
import { WITHDRAWAL_STATUS_TO_TEXT } from "./constants";
import styles from "./index.module.scss";
import { WithdrawalList } from "./types";

import { formatLovelaceAmount, sumBigInt } from "@/modules/bigint-utils";

type Props = {
  isModalOpened: boolean;
  onClose: () => void;
};

// TODO: @sk-tenba: index the withdrawal history
const WITHDRAWALS_HISTORY: WithdrawalList = {
  withdrawals: [
    {
      createdAt: Date.parse("26 June 2023 00:17:00 GMT"),
      numLovelaceWithdrawn: 21597000,
      status: "in-progress",
    },
    {
      createdAt: Date.parse("26 June 2023 00:17:00 GMT"),
      numLovelaceWithdrawn: 21597000,
      status: "done",
    },
    {
      createdAt: Date.parse("26 June 2023 00:17:00 GMT"),
      numLovelaceWithdrawn: 21597000,
      status: "done",
    },
  ],
};
export default function ModalViewWithdrawals({
  isModalOpened,
  onClose,
}: Props) {
  return (
    <Modal open={isModalOpened}>
      <Modal.Header>
        <div className={styles.headerContainer}>
          <div className={styles.headerTitle}>Your Withdrawals</div>
          <button className={styles.closeButton} onClick={onClose}>
            <IconClose />
          </button>
        </div>
      </Modal.Header>
      <Modal.Content>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <tr className={styles.row}>
              <th className={styles.headerTable}>Date</th>
              <th className={styles.headerTable}>Withdrawn</th>
              <th className={styles.headerTable}>Status</th>
            </tr>
            {WITHDRAWALS_HISTORY.withdrawals.map((withdrawal, index) => (
              <tr key={index} className={styles.row}>
                <td className={cx(styles.item, styles.leftItem)}>
                  {moment(new Date(withdrawal.createdAt)).format(
                    "h:mm A, DD MMMM YYYY"
                  )}
                </td>
                <td className={styles.item}>
                  {formatLovelaceAmount(withdrawal.numLovelaceWithdrawn)} ₳
                </td>
                <td
                  style={{
                    color: withdrawal.status === "done" ? "#30925E" : "#00362C",
                  }}
                  className={cx(styles.item, styles.rightItem)}
                >
                  {WITHDRAWAL_STATUS_TO_TEXT[withdrawal.status]}
                </td>
              </tr>
            ))}
          </table>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <div className={styles.totalWithdrawnContainer}>
          <span className={styles.totalWithdrawn}>
            {formatLovelaceAmount(
              sumBigInt(
                WITHDRAWALS_HISTORY.withdrawals.map((withdrawal) =>
                  BigInt(withdrawal.numLovelaceWithdrawn)
                )
              )
            )}{" "}
            ₳
          </span>
          <div className={styles.totalWithdrawnText}>
            Total withdrawn to date
          </div>
        </div>
      </Modal.Actions>
    </Modal>
  );
}
