import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';



@Entity('folders')
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Folder, folder => folder.subfolders, { nullable: true })
  parent?: Folder;

  @OneToMany(() => Folder, folder => folder.parent)
  subfolders: Folder[];

  @OneToMany(() => File, file => file.folder)
  files: File[];
}

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Folder, folder => folder.files, { nullable: false })
  folder: Folder;
}