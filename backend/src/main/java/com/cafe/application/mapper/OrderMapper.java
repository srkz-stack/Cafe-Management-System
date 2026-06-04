package com.cafe.application.mapper;
import com.cafe.application.dto.OrderDTO;
import com.cafe.application.dto.OrderItemDTO;
import com.cafe.domain.model.Order;
import com.cafe.domain.model.OrderItem;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;
@Component
public class OrderMapper {
    public OrderDTO toDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(this::toItemDTO)
                .collect(Collectors.toList());
        return OrderDTO.builder()
                .id(order.getId())
                .items(itemDTOs)
                .status(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .pricingType(order.getPricingType())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
    public List<OrderDTO> toDTOList(List<Order> orders) {
        return orders.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    private OrderItemDTO toItemDTO(OrderItem item) {
        return OrderItemDTO.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItem().getId())
                .menuItemName(item.getMenuItem().getName())
                .menuItemPrice(item.getMenuItem().getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build();
    }
}
