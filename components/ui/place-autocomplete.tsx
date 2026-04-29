"use client"

import { useState, useEffect, useRef } from "react"
import { searchPlaces } from "@/lib/astrology/nominatim"

interface PlaceAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (place: { lat: number; lng: number; formattedPlace: string }) => void
  placeholder?: string
}

export function PlaceAutocomplete({ value, onChange, onSelect, placeholder = "Enter city, country" }: PlaceAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // Debounce search
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    if (value.length < 3) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const results = await searchPlaces(value)
        setSuggestions(results)
        setIsOpen(results.length > 0)
      } catch (error) {
        console.error("Search error:", error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 500) // 500ms debounce

    setDebounceTimer(timer)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [value])

  function handleSelect(suggestion: { display_name: string; lat: string; lon: string }) {
    onChange(suggestion.display_name)
    onSelect({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      formattedPlace: suggestion.display_name,
    })
    setIsOpen(false)
    setSuggestions([])
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
      
      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-md border border-gray-200 bg-white p-2 text-sm text-gray-500 shadow">
          Searching...
        </div>
      )}
      
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-orange-50 focus:bg-orange-50 focus:outline-none"
            >
              {suggestion.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
