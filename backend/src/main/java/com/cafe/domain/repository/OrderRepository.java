package com.cafe.domain.repository;
import com.cafe.domain.model.Order;
import com.cafe.domain.model.OrderStatus;
import java.util.List;
import java.util.Optional;
public interface OrderRepository {
    List<Order> findAll();
    Optional<Order> findById(Long id);
    List<Order> findByStatus(OrderStatus status);
    Order save(Order order);
    void deleteById(Long id);
    boolean existsById(Long id);
}
