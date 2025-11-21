export class EmailValidator {
  public static isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

export class PasswordVisibility {
  private visible: boolean;
  constructor(initialVisible = false) {
    this.visible = initialVisible;
  }
  toggle() {
    this.visible = !this.visible;
    return this.visible;
  }
  get value() {
    return this.visible;
  }
}
