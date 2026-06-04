package com.cafe.infrastructure.persistence;
import com.cafe.domain.model.Order;
import com.cafe.domain.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SpringDataOrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(OrderStatus status);
}
