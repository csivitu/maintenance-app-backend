interface studentDataType {
  name: string;
  Room: {
    number: number;
    Student: {
      name: string;
    }[];
    block: string;
  };
}

interface cleaningJobType {
  time: Date;
  block: string;
  room: {
    number: number;
    block: string;
  };
  staff: string;
}
