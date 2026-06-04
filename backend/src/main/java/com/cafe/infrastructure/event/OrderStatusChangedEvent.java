package com.cafe.infrastructure.event;
import com.cafe.domain.model.OrderStatus;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;
@Getter
public class OrderStatusChangedEvent extends ApplicationEvent {
    private final Long orderId;
    private final OrderStatus previousStatus;
    private final OrderStatus newStatus;
    public OrderStatusChangedEvent(Object source, Long orderId,
                                    OrderStatus previousStatus, OrderStatus newStatus) {
        super(source);
        this.orderId = orderId;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
    }
}
