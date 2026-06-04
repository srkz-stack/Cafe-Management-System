package com.cafe.application.service;
import com.cafe.application.dto.CreateOrderRequest;
import com.cafe.application.dto.OrderDTO;
import com.cafe.application.dto.UpdateOrderStatusRequest;
import com.cafe.application.factory.OrderFactory;
import com.cafe.application.mapper.OrderMapper;
import com.cafe.domain.model.MenuItem;
import com.cafe.domain.model.Order;
import com.cafe.domain.model.OrderStatus;
import com.cafe.domain.repository.MenuItemRepository;
import com.cafe.domain.repository.OrderRepository;
import com.cafe.domain.service.PricingStrategy;
import com.cafe.infrastructure.event.OrderStatusChangedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
@Service
@Slf4j
public class OrderService {
    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderFactory orderFactory;
    private final OrderMapper orderMapper;
    private final ApplicationEventPublisher eventPublisher;
    private final Map<String, PricingStrategy> pricingStrategies;
    public OrderService(OrderRepository orderRepository,
                        MenuItemRepository menuItemRepository,
                        OrderFactory orderFactory,
                        OrderMapper orderMapper,
                        ApplicationEventPublisher eventPublisher,
                        List<PricingStrategy> strategies) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderFactory = orderFactory;
        this.orderMapper = orderMapper;
        this.eventPublisher = eventPublisher;
        this.pricingStrategies = strategies.stream()
                .collect(Collectors.toMap(PricingStrategy::getStrategyName, Function.identity()));
    }
    public List<OrderDTO> getAllOrders() {
        return orderMapper.toDTOList(orderRepository.findAll());
    }
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));
        return orderMapper.toDTO(order);
    }
    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        return orderMapper.toDTOList(orderRepository.findByStatus(status));
    }
    public OrderDTO createOrder(CreateOrderRequest request) {
        String pricingType = request.getPricingType() != null ? request.getPricingType() : "REGULAR";
        PricingStrategy strategy = pricingStrategies.get(pricingType);
        if (strategy == null) {
            throw new IllegalArgumentException("Unknown pricing strategy: " + pricingType);
        }
        List<Long> menuItemIds = request.getItems().stream()
                .map(CreateOrderRequest.OrderItemRequest::getMenuItemId)
                .collect(Collectors.toList());
        Map<Long, MenuItem> menuItemsById = menuItemRepository.findAll().stream()
                .filter(item -> menuItemIds.contains(item.getId()))
                .collect(Collectors.toMap(MenuItem::getId, Function.identity()));
        for (Long requestedId : menuItemIds) {
            if (!menuItemsById.containsKey(requestedId)) {
                throw new IllegalArgumentException("Menu item not found with id: " + requestedId);
            }
            if (!menuItemsById.get(requestedId).getAvailable()) {
                throw new IllegalArgumentException("Menu item is unavailable: " + menuItemsById.get(requestedId).getName());
            }
        }
        Order order = orderFactory.createOrder(request, menuItemsById, strategy);
        Order saved = orderRepository.save(order);
        log.info("Order #{} created — {} items, total: ${}, pricing: {}",
                saved.getId(), saved.getItems().size(), saved.getTotalPrice(), saved.getPricingType());
        return orderMapper.toDTO(saved);
    }
    public OrderDTO updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + id));
        OrderStatus oldStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();
        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);
        eventPublisher.publishEvent(new OrderStatusChangedEvent(this, saved.getId(), oldStatus, newStatus));
        log.info("Order #{} status changed: {} → {}", id, oldStatus, newStatus);
        return orderMapper.toDTO(saved);
    }
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new IllegalArgumentException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
        log.info("Order #{} deleted", id);
    }
}
