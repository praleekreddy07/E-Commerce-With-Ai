package com.dealai.backend.repository;

import com.dealai.backend.entity.ExternalProductOffer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExternalProductOfferRepository extends JpaRepository<ExternalProductOffer, Long> {
    List<ExternalProductOffer> findByProductIdAndAvailableTrue(Long productId);
}
