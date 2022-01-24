import { memo } from "react";
import styles from "./SequenceList.module.scss";
import { Sequence } from "../../../interface/Sequence";

const SequenceList = ({
  sequence,
  openModalRE,
}: {
  sequence: Sequence;
  openModalRE: (props: boolean, value?: any) => void;
}) => {
  const { area }: any = sequence;

  return (
    <>
      <tr>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, sequence)}
        >
          {sequence._id}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, sequence)}
        >
          {String(area!.name)}
        </td>
        <td
          className={styles.table__td}
          onClick={() => openModalRE(true, sequence)}
        >
          {sequence.sequence}
        </td>
      </tr>
    </>
  );
};

export default memo(SequenceList);
