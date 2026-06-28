/**
 * Notification Sysytem
 */

abstract class Notifications {
  constructor(service) {
    this.service = service;
  }

  sendNotification() {
    this.service.send();
  }
}
