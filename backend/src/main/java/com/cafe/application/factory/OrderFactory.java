package com.cafe.application.factory;
import com.cafe.application.dto.CreateOrderRequest;
import com.cafe.domain.model.MenuItem;
import com.cafe.domain.model.Order;
import com.cafe.domain.model.OrderItem;
import com.cafe.domain.model.OrderStatus;
import com.cafe.domain.service.PricingStrategy;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
@Component
public class OrderFactory {
    public Order createOrder(CreateOrderRequest request,
                             Map<Long, MenuItem> menuItemsById,
                             PricingStrategy pricingStrategy) {
        List<OrderItem> orderItems = new ArrayList<>();
        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuItemsById.get(itemReq.getMenuItemId());
            double subtotal = menuItem.getPrice() * itemReq.getQuantity();
            OrderItem orderItem = OrderItem.builder()
                    .menuItem(menuItem)
                    .quantity(itemReq.getQuantity())
                    .subtotal(subtotal)
                    .build();
            orderItems.add(orderItem);
        }
        double total = pricingStrategy.calculateTotal(orderItems);
        return Order.builder()
                .items(orderItems)
                .status(OrderStatus.PENDING)
                .totalPrice(total)
                .pricingType(pricingStrategy.getStrategyName())
                .build();
    }
}
