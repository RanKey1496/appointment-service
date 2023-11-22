import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('ScheduleDay')
export class ScheduleDay {

    @PrimaryGeneratedColumn()
    public id: string;

    @Column({ nullable: false })
    public dayId: number;

    @Column({ nullable: false })
    public startHour: string;

    @Column({ nullable: false })
    public endHour: string;

    @Column({ nullable: false })
    public isHoliday: boolean;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

}