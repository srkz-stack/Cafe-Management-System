package com.cafe.controller;
import com.cafe.application.dto.ApiResponse;
import com.cafe.application.dto.CreateMenuItemRequest;
import com.cafe.application.dto.MenuItemDTO;
import com.cafe.application.service.MenuService;
import com.cafe.domain.model.Category;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {
    private final MenuService menuService;
    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getAllMenuItems() {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getAllMenuItems()));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDTO>> getMenuItemById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getMenuItemById(id)));
    }
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getMenuItemsByCategory(
            @PathVariable Category category) {
        return ResponseEntity.ok(ApiResponse.ok(menuService.getMenuItemsByCategory(category)));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<MenuItemDTO>> createMenuItem(
            @Valid @RequestBody CreateMenuItemRequest request) {
        MenuItemDTO created = menuService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Menu item created", created));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDTO>> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody CreateMenuItemRequest request) {
        MenuItemDTO updated = menuService.updateMenuItem(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Menu item updated", updated));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.ok(ApiResponse.ok("Menu item deleted", null));
    }
}
