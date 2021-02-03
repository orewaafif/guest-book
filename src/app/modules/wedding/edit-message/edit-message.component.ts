import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WeddingUIService } from '../wedding-ui.service';
import { IMessage, WeddingService } from '../wedding.service';

@Component({
  selector: 'app-edit-message',
  templateUrl: './edit-message.component.html',
  styleUrls: ['./edit-message.component.sass']
})
export class EditMessageComponent implements OnInit, OnDestroy {

  unsub$: Subject<any> = new Subject<any>()

  msgForm: FormGroup

  mode: 'create' | 'edit'

  get isEdit(): boolean {
    return this.mode === 'edit'
  }

  get msgControl(): AbstractControl {
    return this.msgForm.get('message')
  }

  get senderControl(): AbstractControl {
    return this.msgForm.get('sender')
  }

  get code(): string {
    return this.wedUIServ.code
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private wedService: WeddingService,
    private wedUIServ: WeddingUIService,
  ) { }

  ngOnInit(): void {
    console.log('edit.msg.code: ', this.wedUIServ.code)
    this.route.params.pipe(takeUntil(this.unsub$.asObservable())).subscribe(async (params) => {

      const { mode } = params
      let msg: IMessage = {}

      this.mode = mode

      try {
        msg = await this.wedService.getMessage(this.code ? `?code=${this.code}` : null).toPromise()
      }
      catch (err) {
        console.error('No message is present yet. Navigating back to create...')
        this.router.navigate(['../create'], { relativeTo: this.route })
      }
      finally {
        if (msg?._id && !this.isEdit) {
          console.error('User already created a message. Navigating back to edit...')
          this.router.navigate(['../edit'], { relativeTo: this.route })
        }
      }

      if (mode !== 'create' && mode !== 'edit' ) {
        console.error('Invalid route. Routing back...')
        this.back()
      }

      this.initForm(msg)
    })
  }

  ngOnDestroy(): void {
    this.unsub$.next()
    this.unsub$.unsubscribe()
  }

  initForm(loadMsg?: IMessage) {
    const { sender, message } = loadMsg || {}

    this.msgForm = new FormGroup({
      sender: new FormControl(sender || '', [charLimitValidator('*', 25), Validators.required]),
      message: new FormControl(message || '', [charLimitValidator('\n', 5), charLimitValidator('*', 240), Validators.required])
    })
  }

  back() {
    this.router.navigate(['../../'], { relativeTo: this.route })
  }

  /**
   * Handles submission from msgForm
   * 
   * Only runs when form is valid
   */
  async onSubmit() {
    if (this.msgForm.invalid) return

    console.log('formValues: ', this.msgForm.value)
    const payload: IMessage = {
      sender: this.msgForm.get('sender').value,
      message: this.msgForm.get('message').value,
    }

    if (this.code) payload.code = this.code

    try {
      if (!this.isEdit) {
        const createdMsg = await this.wedService.createMessage(payload, payload.code ? `?code=${payload.code}` : '').toPromise()
      }
      else {
        const editedMsg = await this.wedService.updateMessage(payload, payload.code ? `?code=${payload.code}` : '').toPromise()
      }

      this.back()
    }
    catch (err) {
      console.error('edit-message.onSubmit().createMessage().err: ', err)
    }
  }

  async deleteMessage() {
    try {
      const deleted = await this.wedService.deleteMessage(this.code ? `?code=${this.code}` : null).toPromise()

      this.back()
    }
    catch (err) {
      console.error('deleteMessage().err: ', err)
    }
  }

}

export const charLimitValidator = (character: string, limit: number, customMessage?: string, customName?: string): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } | null => {

    // const isValid = regex.test(control.value);
    let isValid = false
    if (character === '*' || !character)
      isValid = control.value.length <= limit
    else {
      isValid = control.value.split(character).length <= limit
    }

    const output = {}
    output[customName || 'charLimit'] = { value: control.value, msg: customMessage || 'Character limit exceeded' };

    return isValid ? null : output;
  };
}
