import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EmitMessageService {
    public subject = new Subject<object>();
    public event = this.subject.asObservable();

    public publish(data: any) {
        this.subject.next(data);
    }
}
