package com.cafe.infrastructure.event;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
@Component
@Slf4j
public class OrderEventListener {
    @EventListener
    public void handleOrderStatusChange(OrderStatusChangedEvent event) {
        log.info("📋 [EVENT] Order #{} status changed: {} → {}",
                event.getOrderId(),
                event.getPreviousStatus(),
                event.getNewStatus());
        if (event.getNewStatus() == com.cafe.domain.model.OrderStatus.READY) {
            log.info("🔔 [NOTIFICATION] Order #{} is READY for pickup!", event.getOrderId());
        }
        if (event.getNewStatus() == com.cafe.domain.model.OrderStatus.CANCELLED) {
            log.warn("❌ [ALERT] Order #{} has been CANCELLED", event.getOrderId());
        }
    }
}
